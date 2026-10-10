type AssociationEnvironment = Record<string, string | undefined>;

const identifier = /^[A-Za-z][A-Za-z0-9_-]*(?:\.[A-Za-z][A-Za-z0-9_-]*)+$/;
const fingerprint = /^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/;

function appIdentifier(value: string | undefined, name: string) {
  const result = value?.trim() ?? "";
  if (!identifier.test(result) || result.startsWith("com.example.")) {
    throw new Error(`${name} must identify the registered production app`);
  }
  return result;
}

export function androidAssociation(env: AssociationEnvironment = process.env) {
  const packageName = appIdentifier(env.ANDROID_APP_ID, "ANDROID_APP_ID");
  const fingerprints = (env.ANDROID_APP_LINK_SHA256 ?? "")
    .split(",")
    .map((value) => value.trim().toUpperCase());
  if (
    !fingerprints.length ||
    fingerprints.some((value) => !fingerprint.test(value))
  ) {
    throw new Error(
      "ANDROID_APP_LINK_SHA256 must contain Play app signing SHA-256 fingerprints",
    );
  }
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: [...new Set(fingerprints)],
      },
    },
  ];
}

export function appleAssociation(env: AssociationEnvironment = process.env) {
  const bundleId = appIdentifier(env.IOS_BUNDLE_ID, "IOS_BUNDLE_ID");
  const prefix = env.IOS_APP_ID_PREFIX?.trim() ?? "";
  if (!/^[A-Z0-9]{10}$/.test(prefix)) {
    throw new Error(
      "IOS_APP_ID_PREFIX must match the signed app's application-identifier prefix",
    );
  }
  return {
    applinks: {
      details: [
        {
          appIDs: [`${prefix}.${bundleId}`],
          components: [
            { "/": "/jobs/*" },
            { "/": "/unsubscribe" },
            { "/": "/reset-password" },
          ],
        },
      ],
    },
  };
}
