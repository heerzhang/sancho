/** @jsx jsx */
import { jsx } from "@emotion/react";
import { InputGroup, Select, Input, TextArea, Check } from "../Form";
import { Button } from "../Button";
import theme from "../Theme";
import { Layer } from "../Layer";
import { storiesOf } from "@storybook/react";
import { IconArrowRight, IconAlignCenter } from "../Icons";
import { IconButton } from "../IconButton";

export const FormStories = storiesOf("Forms", module)
  .add("input types", () => (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        paddingTop: theme.spaces.xl,
        paddingBottom: theme.spaces.xl
      }}
    >
      <Layer css={{ maxWidth: "400px", width: "100%" }} elevation={"lg"}>
        <form css={{ padding: theme.spaces.lg }}>
          <InputGroup error="Required field" label="Email address">
            <Input placeholder="ben.mcmahen@gmail.com" />
          </InputGroup>

          <InputGroup label="Gender">
            <Select>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </InputGroup>

          <InputGroup label="Gender">
            <div>
              <Check label="Male" checked />
              <Check label="Female" />
              <Check label="Other" />
            </div>
          </InputGroup>

          <InputGroup
            label="Example textarea"
            helpText="Please provide a brief description of yourself. This will go on your profile."
          >
            <TextArea placeholder="Something about me" />
          </InputGroup>
          <div css={{ textAlign: "right", marginTop: `${theme.spaces.md}` }}>
            <Button intent="primary">Submit</Button>
          </div>
        </form>
      </Layer>
    </div>
  ))

  .add("sizes", () => {
    return (
      <div
        css={{
          margin: "2rem",
          width: "800px",
          "& > div": {
            padding: "1rem",
            "& > *": {
              margin: "1rem"
            }
          }
        }}
      >
        <div>
          <Input
            css={{ display: "inline-block", width: "auto" }}
            defaultValue="hello world"
            inputSize="sm"
          />
          <Button size="sm">Small</Button>
          <Button component="a" href="#" size="sm">
            Small
          </Button>
          <Button
            component="a"
            href="#"
            size="sm"
            iconAfter={<IconArrowRight />}
          >
            Small
          </Button>
        </div>
        <div css={{ display: "flex", alignItems: "cente" }}>
          <Input
            css={{ display: "inline-block", width: "auto" }}
            defaultValue="hello world"
            inputSize="md"
          />
          <Button size="md">Medium</Button>
          <Button component="a" href="#" size="md">
            Medium
          </Button>
          <Button
            component="a"
            href="#"
            size="md"
            iconAfter={<IconArrowRight />}
          >
            Medium
          </Button>
          <IconButton icon={<IconAlignCenter />} label="Align center" />
        </div>
        <div>
          <Input
            css={{ display: "inline-block", width: "auto" }}
            defaultValue="hello world"
            inputSize="lg"
          />
          <Button size="lg">Large</Button>
          <Button component="a" href="#" size="lg">
            Large
          </Button>
          <Button
            component="a"
            href="#"
            size="lg"
            iconAfter={<IconArrowRight />}
          >
            Large
          </Button>
        </div>

        <div />
      </div>
    );
  })
  .add("disabled states", () => (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        paddingTop: theme.spaces.xl,
        paddingBottom: theme.spaces.xl
      }}
    >
      <div css={{ overflowX: "auto" }}>
        <form css={{ display: "flex", padding: theme.spaces.lg }}>
          <div css={{ minWidth: "300px", margin: "1rem" }}>
            <InputGroup label="Email address">
              <Input placeholder="ben.mcmahen@gmail.com" />
            </InputGroup>
            <InputGroup label="Email address">
              <Input disabled placeholder="ben.mcmahen@gmail.com" />
            </InputGroup>
            <InputGroup error="This field is required" label="Email address">
              <Input placeholder="ben.mcmahen@gmail.com" />
            </InputGroup>
          </div>

          <div css={{ minWidth: "300px", margin: "1rem" }}>
            <InputGroup label="Gender">
              <Select>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </InputGroup>
            <InputGroup label="Gender">
              <Select disabled>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </InputGroup>
            <InputGroup error="This field is required" label="Gender">
              <Select>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </InputGroup>
          </div>

          <div css={{ minWidth: "150px", margin: "1rem" }}>
            <InputGroup label="Gender">
              <div>
                <Check disabled label="Male" checked />
                <Check label="Female" />
                <Check label="Other" />
              </div>
            </InputGroup>

            <InputGroup error="You must select a gender" label="Gender">
              <div>
                <Check disabled label="Male" checked />
                <Check label="Female" />
                <Check label="Other" />
              </div>
            </InputGroup>
          </div>
          <div css={{ minWidth: "300px", margin: "1rem" }}>
            <InputGroup
              label="Example textarea"
              helpText="Please provide a brief description of yourself. This will go on your profile."
            >
              <TextArea placeholder="Something about me" />
            </InputGroup>
            <InputGroup
              label="Example textarea"
              helpText="Please provide a brief description of yourself. This will go on your profile."
            >
              <TextArea disabled placeholder="Something about me" />
            </InputGroup>
            <InputGroup
              error="This field is required"
              label="Example textarea"
              helpText="Please provide a brief description of yourself. This will go on your profile."
            >
              <TextArea placeholder="Something about me" />
            </InputGroup>
            <div css={{ textAlign: "right", marginTop: `${theme.spaces.md}` }}>
              <Button disabled intent="primary">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ));
