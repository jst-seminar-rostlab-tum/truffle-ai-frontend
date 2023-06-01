import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import TopBar from '@/components/page/repositoryTable/TopBar'
import Table from '@/components/page/repositoryTable/Table'
import FilterBar, { Filter } from '@/components/page/repositoryTable/Filterbar'
import columns from '@/components/page/repositoryTable/columns'
import { useState } from 'react'
import repositoriesMock from '@/data/repositoriesMock'

const nullFunc = () => null

const RepositoryTable = () => {
  const [filters, setFilters] = useState<Filter[]>([])

  const table = useReactTable({
    data: repositoriesMock,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const removeFilter = (filterToRemove: Filter) => {
    setFilters((x) => x.filter((filter) => filter !== filterToRemove))
    console.log(filterToRemove)
  }

  const addFilter = (filter: Filter) => {
    setFilters((x) => [...x, filter])
    console.log(filters)
  }

  return (
    <div className="flex w-full flex-col rounded-lg py-3.5">
      <TopBar columns={table.getAllLeafColumns()} nullFunc={nullFunc} addFilter={addFilter} />
      <FilterBar filters={filters} removeFilter={removeFilter} />
      <Table table={table} />
    </div>
  )
}
export default RepositoryTable
