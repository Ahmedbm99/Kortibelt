import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFamily, setSelectedFamily] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      {/* NAVBAR */}
      <Navbar
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        showSearch={true}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          selectedCategory={selectedCategory}
  onCategorySelect={setSelectedCategory}
  selectedFamily={selectedFamily}
  onFamilySelect={setSelectedFamily}
      />

      {/* RESPONSIVE SIDEBAR */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            selectedFamily={selectedFamily}
            onFamilySelect={setSelectedFamily}
          />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div
              className="absolute left-0 top-0 h-full w-[260px] bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                selectedCategory={selectedCategory}
                onCategorySelect={(cat) => { setSelectedCategory(cat); setSidebarOpen(false); }}
                selectedFamily={selectedFamily}
                onFamilySelect={(fam) => { setSelectedFamily(fam); setSidebarOpen(false); }}
              />
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 lg:ml-0">
          <Outlet context={{ searchQuery, selectedCategory, selectedFamily }} />
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
