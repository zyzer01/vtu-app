import { Separator } from "@/components/ui/separator";
import { AccountForm } from "@/components/settings/account-form";
import { headers } from "next/headers";

export default function SettingsAccountPage() {
  const headersList = headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    console.log("User not found");
    return <div>User not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and timezone.
        </p>
      </div>
      <Separator />
      <AccountForm userId={userId} />
    </div>
  );
}
