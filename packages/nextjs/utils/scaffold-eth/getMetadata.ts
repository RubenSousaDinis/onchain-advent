import type { Metadata } from "next";
import { BASE_URL } from "~~/constants";

const titleTemplate = "%s | Scaffold-ETH 2";

export const getMetadata = ({
  title,
  description,
  imageRelativePath = "/thumbnail.jpg"
}: {
  title: string;
  description: string;
  imageRelativePath?: string;
}): Metadata => {
  const imageUrl = `${BASE_URL}${imageRelativePath}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: titleTemplate
    },
    description: description,
    openGraph: {
      title: {
        default: title,
        template: titleTemplate
      },
      description: description,
      images: [
        {
          url: imageUrl
        }
      ]
    },
    twitter: {
      title: {
        default: title,
        template: titleTemplate
      },
      description: description,
      images: [imageUrl]
    },
    icons: {
      icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }]
    }
  };
};
