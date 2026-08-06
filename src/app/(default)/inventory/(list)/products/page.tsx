import { ErpTeb } from '@/common/components/ui/teb';

export default function InventoryProducts() {
  return (
    <>
      <h1 className="text-center">제품</h1>
      <ErpTeb domain="inventory" />
    </>
  );
}
