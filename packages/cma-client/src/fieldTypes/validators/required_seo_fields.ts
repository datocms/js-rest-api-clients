/**
 * SEO field has to specify one or more properties, or it won't be valid.
 */
export type RequiredSeoFieldsValidator =
  | {
      /** Whether the meta title must be specified */
      title: boolean /** Whether the meta description must be specified */;
      description?: boolean /** Whether the social sharing image must be specified */;
      image?: boolean /** Whether the type of Twitter card must be specified */;
      twitter_card?: boolean;
    }
  | {
      /** Whether the meta title must be specified */
      title?: boolean /** Whether the meta description must be specified */;
      description: boolean /** Whether the social sharing image must be specified */;
      image?: boolean /** Whether the type of Twitter card must be specified */;
      twitter_card?: boolean;
    }
  | {
      /** Whether the meta title must be specified */
      title?: boolean /** Whether the meta description must be specified */;
      description?: boolean /** Whether the social sharing image must be specified */;
      image: boolean /** Whether the type of Twitter card must be specified */;
      twitter_card?: boolean;
    }
  | {
      /** Whether the meta title must be specified */
      title?: boolean /** Whether the meta description must be specified */;
      description?: boolean /** Whether the social sharing image must be specified */;
      image?: boolean /** Whether the type of Twitter card must be specified */;
      twitter_card: boolean;
    };
