/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // },
    // {
    //     id      : 'navigation-features.level.0',
    //     title   : 'Level 0',
    //     icon    : 'heroicons_outline:check-circle',
    //     type    : 'collapsable',
    //     children: [
    //         {
    //             id   : 'navigation-features.level.0.1-1',
    //             title: 'Level 1.1',
    //             type : 'basic'
    //         },
    //         {
    //             id   : 'navigation-features.level.0.1-2',
    //             title: 'Level 1.2',
    //             type : 'basic'
    //         }
    //     ]
    // },
    {
        icon: 'heroicons_outline:check-circle',
        id: '28',
        title: 'User Management',
        type: 'collapsable',
        children: [
          {
            id: '25',
            title: 'Create Fense',
            type: 'basic',
            link: './user-management/circles'
          },
          {
            id: '.26',
            title: 'Roles',
            type: 'basic',
            link: '/user-management/roles'
          },
          {
            id: '106',
            title: 'Assign Page',
            type: 'basic',
            link: '/user-management/assign-pages'
          },
          {
            id: '118',
            title: 'Pages',
            type: 'basic',
            link: '/user-management/pages'
          }
        ],
      }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
