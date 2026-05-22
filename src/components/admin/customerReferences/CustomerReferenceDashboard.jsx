import CustomerReferenceFilters from './CustomerReferenceFilters';
import CustomerReferenceTable from './CustomerReferenceTable';

export default function CustomerReferenceDashboard({
  references,
  permissionsByRef,
  linkedCounts,
  lastActivity,
  filters,
  onFiltersChange,
  onCreate,
  onSelect,
  selectedId,
  creating,
}) {
  return (
    <div className="space-y-4">
      <CustomerReferenceFilters filters={filters} onChange={onFiltersChange} onCreate={onCreate} creating={creating} />
      <CustomerReferenceTable
        references={references}
        permissionsByRef={permissionsByRef}
        linkedCounts={linkedCounts}
        lastActivity={lastActivity}
        onSelect={onSelect}
        selectedId={selectedId}
      />
    </div>
  );
}
