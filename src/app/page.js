import Hero from "@/components/hero/Hero";
import BrandStatement from "@/components/home/BrandStatement";
import ShopBySport from "@/components/home/ShopBySport";
import NewDrop from "@/components/home/NewDrop";
import PerformanceTech from "@/components/home/PerformanceTech";
import Interactive3D from "@/components/home/Interactive3D";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <BrandStatement />
      <ShopBySport />
      <NewDrop />
      <PerformanceTech />
      <Interactive3D />
    </div>
  );
}
