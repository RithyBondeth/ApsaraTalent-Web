import ts from "typescript";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Read literal content through the TypeScript AST; never execute page code.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const documents = {};
const sourceHashes = {};
for (const name of [
  "terms",
  "privacy",
  "product",
  "learn",
  "safety",
  "support",
]) {
  const path = `app/(${["terms", "privacy"].includes(name) ? "legal" : "landing"})/${name}/_content.tsx`;
  const source = await readFile(resolve(root, path), "utf8");
  const file = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const declarations = new Map();
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        declarations.set(declaration.name.text, declaration.initializer);
      }
    }
  }
  function literal(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node))
      return literal(node.expression);
    if (ts.isIdentifier(node) && declarations.has(node.text))
      return literal(declarations.get(node.text));
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    if (ts.isObjectLiteralExpression(node))
      return Object.fromEntries(
        node.properties.map((property) => {
          if (ts.isShorthandPropertyAssignment(property))
            return [property.name.text, literal(property.name)];
          if (ts.isPropertyAssignment(property))
            return [property.name.text, literal(property.initializer)];
          throw new Error(`Non-literal content property in ${path}`);
        }),
      );
    throw new Error(`Non-literal content expression in ${path}`);
  }
  const content = declarations.get("content");
  if (!content) throw new Error(`Content catalog is missing: ${path}`);
  documents[name] = literal(content);
  if (!documents[name].en?.pageTitle || !documents[name].km?.pageTitle) {
    throw new Error(`Both language titles are required: ${path}`);
  }
  sourceHashes[path] = createHash("sha256").update(source).digest("hex");
}
const output =
  JSON.stringify({ version: 1, documents, sourceHashes }, null, 2) + "\n";
const target = resolve(root, "contracts/public-content.json");
if (process.argv.includes("--check")) {
  if ((await readFile(target, "utf8")) !== output)
    throw new Error(
      "Public content snapshot is stale; run npm run resources:export",
    );
  console.log(
    "Public content snapshot matches all six web pages in English and Khmer.",
  );
} else {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, output);
  if (process.argv.includes("--mobile")) {
    const mobile = resolve(
      root,
      "../ApsaraTalent-Mobile/assets/public_content.json",
    );
    await mkdir(dirname(mobile), { recursive: true });
    await writeFile(mobile, output);
  }
  console.log("Exported the canonical public content catalog.");
}
