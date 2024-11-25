import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog" ;
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from "@/components/ui/drawer";
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface DialogOrDrawerProps {
    title : React.ReactNode;
    description : React.ReactNode;
    trigger: React.ReactNode;  // trigger can be any React element or component
    children: React.ReactNode; // children can be any valid JSX content
}
const DialogOrDrawer = ({ title, description, trigger, children } : DialogOrDrawerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)"); // Adjust as needed for mobile screen width

  return (
    <>
      {isMobile ? (
        // Drawer for mobile screens
        <Drawer>
          <DrawerTrigger asChild>
            {trigger}
          </DrawerTrigger>
          <DrawerContent className='flex flex-col'>
            <ScrollArea className="h-[60vh] p-2">
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>
                        {description}
                    </DrawerDescription>
                </DrawerHeader>
                {children}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      ) : (
        // Dialog for larger screens
        <Dialog>
          <DialogTrigger asChild>
            {trigger}
          </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DialogOrDrawer;
