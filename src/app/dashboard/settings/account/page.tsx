import { Separator } from "@/components/ui/separator";
import { AccountForm } from "@/components/settings/account-form";
import { headers } from "next/headers";
import User from "@/app/models/User";
import dbConnect from "@/lib/db";

export default async function SettingsAccountPage() {

  await dbConnect()
  const headersList = headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    console.log("User not found");
    return <div>User not found</div>;
  }

  const user = await User.findById(userId);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and timezone.
        </p>
      </div>
      <Separator />
      <AccountForm id={user._id} email={user.email} />
    </div>
  );
}
