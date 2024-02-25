export const pageDestinations = {
    root: '/',
    guest: {
        home: '/welcome',
        login: '/login',
        register: '/register',
    },
    user: {
        calling: '/calling',
        call: '/call',
        recents: '/recent',
        messages: '/messages',
        notes: '/notes',
        protect: '/protect',
        protectorHQ: '/protectorhq',
        settings: '/setting',
        logout: '/logout',
        specific: {
            note: '/note/:id',
            message: '/message/:id',
            calling: '/calling',
            warning: '/warning',
            protectorHQScreen: '/protectorHQScreen',
        },
        contacts: '/contact',
    },
    common:  {
        permission: '/c/permission',
    }
}

export const mediaDestinations = {
    guest: {
        home: {
            slide: {
                telenote: "/assets/guest_home/slide_telenote.png",
                protect: "/assets/guest_home/slide_protect.png",
            }
        }
    },
    user: {
        telenotes: {
            avatar: {
                default: "/assets/user_telenotes/avatar_default.svg"
            }
        },
        protector: {
            slide: {
                end: "/assets/user_protector/slide_end.png"
            }
        }
    }
};