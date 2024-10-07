import { headers } from "next/headers";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";
import { UserNav } from "@/components/dashboard/user-nav";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import User from "../models/User";
import dbConnect from "@/lib/db";
import PhoneNumberExtractor from "@/components/dashboard/phone-number-extractor";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  await dbConnect();

  const headersList = headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    console.log("User not found");
    return <div>User not found</div>;
  }

  const user = await User.findById(userId);

  return (
    <>
      <div className="flex-col flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <ThemeSwitcher />
              <UserNav
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                profilePicture={user.profilePicture}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Buy Data (Bulk)</TabsTrigger>
              <TabsTrigger value="analytics">
                Buy Airtime
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notify
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <PhoneNumberExtractor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
