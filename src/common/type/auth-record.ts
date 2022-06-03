type Aud =
    | 'adonis-os-blog-local'
    | 'adonis-os-blog-staging'
    | 'adonis-os-blog-production';

type FilterForUpdateAuth = Readonly<{
    uid: string;
    aud: Aud;
    authTime: number;
}>;

type InsertAuth = Readonly<
    FilterForUpdateAuth & {
        timeCreated: Date;
    } & (
            | {
                  type: 'email-undefined';
              }
            | {
                  type: 'email-defined';
                  email: string;
              }
        )
>;

type UpdateAuth = Readonly<{
    timeLoggedOut: Date;
}>;

export type { Aud, FilterForUpdateAuth, InsertAuth, UpdateAuth };
