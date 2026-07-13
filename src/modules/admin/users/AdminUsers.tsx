import UsersTable from "./UsersTable";

export default function AdminUsers() {
  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="container mx-auto pt-8">
        <div className="mb-8">
          <h1
            className="text-3xl text-white mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            مدیریت کاربران
          </h1>
          <p className="text-white/60 text-sm">
            مشاهده و ویرایش دسترسی‌های کاربران سیستم
          </p>
        </div>

        <UsersTable />
      </div>
    </div>
  );
}
