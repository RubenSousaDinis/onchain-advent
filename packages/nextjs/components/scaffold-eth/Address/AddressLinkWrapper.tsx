import Link from "next/link";

type AddressLinkWrapperProps = {
  children: React.ReactNode;
  disableAddressLink?: boolean;
  blockExplorerAddressLink: string;
};

export const AddressLinkWrapper = ({
  children,
  disableAddressLink,
  blockExplorerAddressLink,
}: AddressLinkWrapperProps) => {
  return disableAddressLink ? (
    <>{children}</>
  ) : (
    <Link href={blockExplorerAddressLink} target={"_blank"} rel={"noopener noreferrer"}>
      {children}
    </Link>
  );
};
