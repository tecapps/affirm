// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    ignores: ["worker-configuration.d.ts"],
  },
  {
    rules: {
      // Prettier formats void elements as `<input />`, so require that form instead of fighting it.
      "vue/html-self-closing": [
        "warn",
        {
          html: { void: "always", normal: "always", component: "always" },
          svg: "always",
          math: "always",
        },
      ],
    },
  },
);
