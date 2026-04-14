import { HomeBlockRenderer } from "@/components/cms/home-block-renderer";
import { storefrontData } from "@/lib/storefront";

export default function HomePage() {
  const page = storefrontData.homePage();

  return (
    <div className="pb-10">
      {page.blocks.map((block, index) => (
        <HomeBlockRenderer key={`${block.blockType}-${index}`} block={block} />
      ))}
    </div>
  );
}
