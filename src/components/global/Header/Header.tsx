import { useState } from "react";

import TabBar from "@/components/common/TabBar";
import { useSetting } from "@/stores/SettingsStore";

import { Navigation, Search, Cache, SettingsContainer, SettingsModal } from "./components";

export default function Header() {
  const preferredTabs = useSetting('preferredTabs');
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <header className="site-header">
        <section className="top-header">
          <Navigation />
          <SettingsContainer setOpenModal={setOpenModal} />
        </section>

        <section className="header-content">
          <TabBar tabs={tabItem => [
            tabItem('search', 'Search', <Search />),
            tabItem('history', 'History', <Cache />),
          ]}
            defaultTab={preferredTabs.get()?.searchOrHistory}
          />
        </section>
      </header>
      <SettingsModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}