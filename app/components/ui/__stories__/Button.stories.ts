import type { Meta, StoryObj } from "@storybook/vue3";
import Button from "../Button.vue";

const meta: Meta<typeof Button> = {
  title: "Components/UI/Button",
  component: Button,
  argTypes: {
    type: {
      control: "radio",
      options: ["primary", "secondary", "accent"],
    },
    to: {
      control: "text",
      description: "The URL or route to navigate to when the button is clicked",
    },
    isSubmit: {
      control: "boolean",
      description: "Whether the button is a submit button for forms",
    },
    default: {
      control: "text",
    },
  },
  args: {
    default: "Click me",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    type: "primary",
  },
};

export const Secondary: Story = {
  args: {
    type: "secondary",
  },
};

export const Accent: Story = {
  args: {
    type: "accent",
  },
};

export const WithLink: Story = {
  args: {
    to: "/example",
  },
};

export const SubmitButton: Story = {
  args: {
    isSubmit: true,
  },
};
