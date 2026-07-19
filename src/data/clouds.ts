export type CloudAsset = {
  id: string
  label: string
  src: string
  alt?: string
  width?: number
  height?: number
}

export const cloudAssets: CloudAsset[] = [
  {
    id: 'large-cloud-1',
    label: 'Large Cloud 1',
    src: '/large_cloud1.png',
    alt: 'Large cloud 1',
    width: 991,
    height: 505,
  },
  {
    id: 'large-cloud-2',
    label: 'Large Cloud 2',
    src: '/large_cloud2.png',
    alt: 'Large cloud 2',
    width: 594,
    height: 221,
  },
  {
    id: 'large-cloud-3',
    label: 'Large Cloud 3',
    src: '/large_cloud3.png',
    alt: 'Large cloud 3',
    width: 898,
    height: 390,
  },
  {
    id: 'medium-cloud-1',
    label: 'Medium Cloud 1',
    src: '/medium_cloud1.png',
    alt: 'Medium cloud 1',
    width: 535,
    height: 220,
  },
  {
    id: 'small-cloud-1',
    label: 'Small Cloud 1',
    src: '/small_cloud1.png',
    alt: 'Small cloud 1',
    width: 610,
    height: 200,
  },
  {
    id: 'small-cloud-2',
    label: 'Small Cloud 2',
    src: '/small_cloud2.png',
    alt: 'Small cloud 2',
    width: 282,
    height: 123,
  },
  {
    id: 'small-cloud-3',
    label: 'Small Cloud 3',
    src: '/small_cloud3.png',
    alt: 'Small cloud 3',
    width: 390,
    height: 199,
  },
  {
    id: 'small-cloud-4',
    label: 'Small Cloud 4',
    src: '/small_cloud4.png',
    alt: 'Small cloud 4',
    width: 530,
    height: 161,
  },
]
