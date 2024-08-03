import React from "react";
import { Button } from "./ui/button";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      Add {pending && <Loader2 />}
    </Button>
  );
}

export default SubmitButton;
