import { TbTrash } from 'react-icons/tb'
import {
  BsSortAlphaDown,
  BsSortAlphaUpAlt,
  BsSortNumericDownAlt,
  BsSortNumericUp
} from 'react-icons/bs'
import { IconType } from 'react-icons'
import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@primer/octicons-react'
import Button from '@/components/pure/Button'
import { OrderByDirection, ProjectOrderBy } from '@/graphql/generated/gql'
import { filterOptions } from './types'
import MenuItemsTransition from './MenuItemsTransition'

const ASC = OrderByDirection.AscNullsLast
const DESC = OrderByDirection.DescNullsLast

const textGray100 = 'text-gray-100'
const textGray500 = 'text-gray-500'

type SortModalProps = {
  sorting: ProjectOrderBy
  setSorting: (sort: ProjectOrderBy | null) => void
}

const SortModal = ({ sorting, setSorting }: SortModalProps) => {
  const currentKey = Object.keys(sorting)[0] as keyof ProjectOrderBy
  const column = filterOptions.find((option) => option.key === currentKey)?.column
  const currentDirection = sorting[currentKey]

  let SortIcon: IconType

  if (currentKey === 'name') {
    SortIcon = currentDirection === ASC ? BsSortAlphaUpAlt : BsSortAlphaDown
  } else {
    SortIcon = currentDirection === ASC ? BsSortNumericUp : BsSortNumericDownAlt
  }

  return (
    <Popover as="div" className="relative inline-block text-left">
      {({ open, close }) => (
        <>
          <Popover.Button className="flex h-[30px] flex-row  items-center space-x-2 rounded-[5px] border border-gray-800 bg-gray-850 px-2 py-1.5 text-14 outline-none transition-colors duration-100 hover:bg-gray-700">
            <div className="flex flex-row items-center space-x-1">
              <SortIcon className={textGray500} />

              <p className="text-14 text-gray-100">{column}</p>

              <ChevronDownIcon
                className={`text-gray-500 transition-transform duration-200 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </div>
          </Popover.Button>

          <MenuItemsTransition>
            <Popover.Panel
              className={`absolute left-0 z-40 mt-2 rounded-[5px] bg-gray-700 shadow-lg focus:outline-none ${
                open ? 'block' : 'hidden'
              }`}
            >
              <div className="flex flex-col space-y-3 p-2">
                <div className="flex flex-row justify-between">
                  <p className="text-14 text-gray-100">{column}</p>
                  <Button
                    onClick={() => setSorting(null)}
                    variant="onlyIconNoBorderNoBG"
                    Icon={TbTrash}
                  />
                </div>

                <div className="flex flex-row space-x-1">
                  <Button
                    onClick={() => {
                      setSorting({ [currentKey]: ASC })
                      close()
                    }}
                    variant={currentDirection === ASC ? 'highlighted' : 'normal'}
                    text="Asc."
                    Icon={currentKey === 'name' ? BsSortAlphaUpAlt : BsSortNumericUp}
                    order="ltr"
                    iconColor={currentDirection === ASC ? textGray100 : textGray500}
                    textColor={currentDirection === ASC ? textGray100 : textGray500}
                  />

                  <Button
                    onClick={() => {
                      setSorting({ [currentKey]: DESC })
                      close()
                    }}
                    variant={currentDirection === DESC ? 'highlighted' : 'normal'}
                    text="Desc."
                    Icon={currentKey === 'name' ? BsSortAlphaDown : BsSortNumericDownAlt}
                    order="ltr"
                    iconColor={currentDirection === DESC ? textGray100 : textGray500}
                    textColor={currentDirection === DESC ? textGray100 : textGray500}
                  />
                </div>
              </div>
            </Popover.Panel>
          </MenuItemsTransition>
        </>
      )}
    </Popover>
  )
}

export default SortModal
