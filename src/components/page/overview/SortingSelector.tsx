import { FC } from 'react'
import { Menu } from '@headlessui/react'
import { AiOutlineNumber } from 'react-icons/ai'
import { IoTextOutline } from 'react-icons/io5'
import { TbArrowsSort } from 'react-icons/tb'
import Button from '@/components/pure/Button'
import { OrderByDirection, ProjectOrderBy } from '@/graphql/generated/gql'
import MenuItemsTransition from './MenuItemsTransition'
import { filterOptions } from './types'

type SortingSelectorProps = {
  sorting: ProjectOrderBy | null
  updateSorting: (sort: ProjectOrderBy | null) => void
}

const SortingSelector: FC<SortingSelectorProps> = ({ sorting, updateSorting }) => (
  <Menu as="div" className="relative">
    <Menu.Button as="div">
      <Button
        Icon={TbArrowsSort}
        text="Sorting"
        variant="normal"
        order="ltr"
        className={sorting ? 'bg-gray-850' : ''}
      />
    </Menu.Button>

    <MenuItemsTransition>
      <Menu.Items className="absolute left-0 z-30 mt-2 origin-top-right rounded-[5px] bg-gray-700 p-1 shadow-lg focus:outline-none">
        {/* Populate sort modal, filter out currently sorted by key */}
        {filterOptions
          .filter(({ key }) => key !== Object.keys(sorting || {})[0])
          .map(({ key, column, type }) => (
            <Menu.Item
              as="button"
              key={key}
              onClick={() => {
                updateSorting({
                  [key]: OrderByDirection.DescNullsLast
                })
              }}
              className="flex min-w-[150px] items-center gap-2 rounded-[5px] p-2 text-left text-14 text-gray-100 hover:bg-gray-600"
            >
              {type === 'string' ? (
                <IoTextOutline className="text-gray-500" />
              ) : (
                <AiOutlineNumber className="text-gray-500" />
              )}

              <p className="text-14 text-gray-100">{column}</p>
            </Menu.Item>
          ))}
      </Menu.Items>
    </MenuItemsTransition>
  </Menu>
)

export default SortingSelector
