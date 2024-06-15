import {
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
} from "@/api/d/bes/emailTemplates";
import { useGetInstanceQuery } from "@/api/instances";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

interface EmailTemplateEditorProps {
  template: EmailTemplate | null;
  onSelectChange: (template: EmailTemplate | null) => void;
}

const EmailTemplateEditor = ({
  template,
  onSelectChange,
}: EmailTemplateEditorProps) => {
  const params = useParams<{ type: string; instanceId: string }>();
  const { type: serviceType, instanceId } = params;
  const { data: { instance } = {} } = useGetInstanceQuery({
    serviceType: serviceType as string,
    instanceId: instanceId as string,
  });
  const [createEmailTemplate] = useCreateEmailTemplateMutation();
  const [updateEmailTemplate] = useUpdateEmailTemplateMutation();

  // editor state
  const [isEditing, setIsEditing] = useState(!template);

  const handleSave = async (data: Record<string, string>) => {
    try {
      if (template) {
        await updateEmailTemplate({
          instanceId: instanceId,
          templateId: template._id,
          template: data,
        }).unwrap();
      } else {
        const { template: createdTemplate } = await createEmailTemplate({
          instanceId: instanceId,
          template: data,
        }).unwrap();
        if (onSelectChange instanceof Function) onSelectChange(createdTemplate);
      }
      toast.success("Template saved successfully");
      setIsEditing(false);
    } catch (error: any) {
      if (error && "data" in error) toast.error((error.data as any).message);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });
    handleSave(data);
  };

  const highlightVariables = (text: string): JSX.Element => {
    const regex = /{{(.*?)}}/g;
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 0) return <span key={index}>{part}</span>;
          return (
            <span key={index} className="font-semibold">
              {part}
            </span>
          );
        })}
      </>
    );
  };

  return isEditing ? (
    <form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex gap-4">
        <Input
          name="name"
          placeholder="Template Name"
          defaultValue={template?.name || "New Template"}
          className="flex-1"
        />
        <Button className="p-6 pt-0 pb-0" type="submit">
          Save
        </Button>
      </div>
      <div className="flex space-x-1">
        <Input
          name="subject"
          placeholder="Subject"
          defaultValue={template?.subject}
          className="flex-1"
        />
      </div>
      <div className="flex space-x-1">
        <Textarea
          name="body"
          placeholder="Body"
          defaultValue={template?.body}
          className="flex-1"
        />
      </div>
    </form>
  ) : (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex gap-4">
        <p className="flex-1 font-semibold">
          {template?.name || "New Template"}
        </p>
        <Button
          className="p-6 pt-0 pb-0"
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(true);
          }}
        >
          Edit
        </Button>
      </div>
      <div className="border border-muted p-4 rounded-md flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Template Id</p>
            <p className="flex-1">{template?._id}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">From</p>
            <p className="flex-1">{instance?.creds?.email}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Subject</p>
          <p className="flex-1 bg-muted/70 rounded-sm p-3">
            {template?.subject
              ? highlightVariables(template?.subject)
              : "No subject provided"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Message</p>
          <p className="flex-1 whitespace-pre bg-muted/70 rounded-sm p-3">
            {template?.body
              ? highlightVariables(template?.body)
              : "No message provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;