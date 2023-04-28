import { useSidebarDrawer } from '@/contexts/SidebarDrawerContext'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useBreakpointValue,
} from '@chakra-ui/react'
import { SideBarNav } from './SideBarNav'

export function Sidebar() {
  const { isOpen, onClose } = useSidebarDrawer()
  const isDrawerSideBar = useBreakpointValue({
    base: true,
    lg: false,
  })

  if (isDrawerSideBar) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bgColor="gray.800" p="4">
            <DrawerCloseButton mt="6" />
            <DrawerHeader>Navegação</DrawerHeader>

            <DrawerBody>
              <SideBarNav />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    )
  }
  return (
    <Box as="aside" w="64" mr="8">
      <SideBarNav />
    </Box>
  )
}
