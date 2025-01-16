import DashboardLayout from "@/components/layout/dashboard-layout"
import { useFilteredNavigation } from "@/lib/authorization"
import { navigations } from "./navigations"
import { AuthLoader } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"
import GlobalAlertDialog from "@/components/ui/global-alert-dialog/global-alert-dialog"
import ImagePreviewer from "@/components/ui/image-previewer/image-previewer"

export const Layout = ({
    children
} : {
    children : React.ReactNode
}) => {
    const navigationItems = useFilteredNavigation(navigations);
    return (
        <AuthLoader
            renderLoading={() => (
            <div className="flex h-screen w-screen items-center justify-center">
                <Spinner size="xl" />
            </div>
            )}
        >
            <DashboardLayout navigations={navigationItems}>
                {children}
            </DashboardLayout>
            <ImagePreviewer/>
            <GlobalAlertDialog/>
        </AuthLoader>
    )
}