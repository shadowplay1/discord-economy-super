import If from './If'

type DataIdentifier<MemberIDRequired extends boolean = true> = If<
    MemberIDRequired,
    { guildID: string, memberID: string },
    { guildID: string }
>

export = DataIdentifier