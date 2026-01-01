import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectedType } from "@/store/typeSlice";
import SidebarClassification from "@/components/Sidebar";

export default function Layout() {
  const dispatch = useDispatch();
  const CategorySelectedFromStore = useSelector(
    (state) => state.type.selectedCategory
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory] = useState(
    CategorySelectedFromStore ?? "all"
  );
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCategorySelect = (cat) => {
    dispatch(selectedType(cat)); // optional if you want Redux update
  };

  const handleFamilySelect = (fam) => {
    setSelectedFamily(fam);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      <Navbar
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        showSearch
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        selectedFamily={selectedFamily}
        onFamilySelect={handleFamilySelect}
      />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SidebarClassification
            selectedFamilly={selectedFamily} // match spelling
            onFamilySelect={handleFamilySelect}
          />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-[260px] bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarClassification
                selectedCategory={selectedCategory}
                selectedFamilly={selectedFamily}
                onFamilySelect={(fam) => {
                  handleFamilySelect(fam);
                  setSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        <main className="flex-1 p-4 lg:ml-0">
          <Outlet
            context={{ searchQuery, selectedFamily }}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}
