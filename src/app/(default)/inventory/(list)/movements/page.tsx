import { ErpTeb } from '@/common/components/ui/teb';

export default function InventoryMovements() {
  return (
    <>
      <h1 className="text-center">입출고</h1>
      <ErpTeb domain="inventory" />
    </>
  );
}
