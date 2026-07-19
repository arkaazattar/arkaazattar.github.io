export type CloudAsset = {
  id: string
  label: string
  src: string
  alt?: string
  width: number
  height: number
}

export type SkylineCloud = CloudAsset & {
  bobOffset: number
  loopOffsetSeconds: number
  opacity: number
  reflectionOpacity: number
  scale: number
  top: number
  travelDurationSeconds: number
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

function getCloudAsset(id: string) {
  const asset = cloudAssets.find((cloud) => cloud.id === id)

  if (!asset) {
    throw new Error(`Missing cloud asset: ${id}`)
  }

  return asset
}

export const skylineClouds: SkylineCloud[] = [
  {
    ...getCloudAsset('large-cloud-1'),
    bobOffset: 0.34,
    loopOffsetSeconds: 28,
    opacity: 1,
    reflectionOpacity: 0.12,
    scale: 0.38,
    top: 18,
    travelDurationSeconds: 300,
  },
  {
    ...getCloudAsset('small-cloud-2'),
    bobOffset: 0.22,
    loopOffsetSeconds: 74,
    opacity: 1,
    reflectionOpacity: 0.11,
    scale: 0.78,
    top: 11,
    travelDurationSeconds: 158,
  },
  {
    ...getCloudAsset('large-cloud-2'),
    bobOffset: 0.26,
    loopOffsetSeconds: 8,
    opacity: 1,
    reflectionOpacity: 0.13,
    scale: 0.55,
    top: 28,
    travelDurationSeconds: 280,
  },
  {
    ...getCloudAsset('large-cloud-3'),
    bobOffset: 0.3,
    loopOffsetSeconds: 103,
    opacity: 1,
    reflectionOpacity: 0.12,
    scale: 0.42,
    top: 17,
    travelDurationSeconds: 312,
  },
  {
    ...getCloudAsset('medium-cloud-1'),
    bobOffset: 0.2,
    loopOffsetSeconds: 49,
    opacity: 1,
    reflectionOpacity: 0.1,
    scale: 0.48,
    top: 35,
    travelDurationSeconds: 210,
  },
  {
    ...getCloudAsset('small-cloud-1'),
    bobOffset: 0.24,
    loopOffsetSeconds: 91,
    opacity: 1,
    reflectionOpacity: 0.11,
    scale: 0.42,
    top: 31,
    travelDurationSeconds: 202,
  },
  {
    ...getCloudAsset('small-cloud-3'),
    bobOffset: 0.18,
    loopOffsetSeconds: 17,
    opacity: 1,
    reflectionOpacity: 0.1,
    scale: 0.56,
    top: 40,
    travelDurationSeconds: 232,
  },
  {
    ...getCloudAsset('small-cloud-4'),
    bobOffset: 0.28,
    loopOffsetSeconds: 63,
    opacity: 1,
    reflectionOpacity: 0.1,
    scale: 0.5,
    top: 12,
    travelDurationSeconds: 262,
  },
  {
    ...getCloudAsset('large-cloud-1'),
    id: 'large-cloud-1-high-drift',
    bobOffset: 0.2,
    loopOffsetSeconds: 146,
    opacity: 0.88,
    reflectionOpacity: 0.08,
    scale: 0.28,
    top: 8,
    travelDurationSeconds: 336,
  },
  {
    ...getCloudAsset('large-cloud-2'),
    id: 'large-cloud-2-low-drift',
    bobOffset: 0.18,
    loopOffsetSeconds: 192,
    opacity: 0.92,
    reflectionOpacity: 0.1,
    scale: 0.42,
    top: 43,
    travelDurationSeconds: 246,
  },
  {
    ...getCloudAsset('large-cloud-3'),
    id: 'large-cloud-3-far-drift',
    bobOffset: 0.24,
    loopOffsetSeconds: 231,
    opacity: 0.84,
    reflectionOpacity: 0.08,
    scale: 0.32,
    top: 24,
    travelDurationSeconds: 356,
  },
  {
    ...getCloudAsset('medium-cloud-1'),
    id: 'medium-cloud-1-high-drift',
    bobOffset: 0.16,
    loopOffsetSeconds: 117,
    opacity: 0.9,
    reflectionOpacity: 0.08,
    scale: 0.36,
    top: 15,
    travelDurationSeconds: 224,
  },
  {
    ...getCloudAsset('small-cloud-1'),
    id: 'small-cloud-1-high-drift',
    bobOffset: 0.18,
    loopOffsetSeconds: 258,
    opacity: 0.9,
    reflectionOpacity: 0.08,
    scale: 0.34,
    top: 7,
    travelDurationSeconds: 218,
  },
  {
    ...getCloudAsset('small-cloud-2'),
    id: 'small-cloud-2-mid-drift',
    bobOffset: 0.14,
    loopOffsetSeconds: 21,
    opacity: 0.94,
    reflectionOpacity: 0.09,
    scale: 0.62,
    top: 32,
    travelDurationSeconds: 182,
  },
  {
    ...getCloudAsset('small-cloud-3'),
    id: 'small-cloud-3-high-drift',
    bobOffset: 0.17,
    loopOffsetSeconds: 311,
    opacity: 0.86,
    reflectionOpacity: 0.08,
    scale: 0.44,
    top: 20,
    travelDurationSeconds: 268,
  },
  {
    ...getCloudAsset('small-cloud-4'),
    id: 'small-cloud-4-low-drift',
    bobOffset: 0.21,
    loopOffsetSeconds: 156,
    opacity: 0.9,
    reflectionOpacity: 0.09,
    scale: 0.4,
    top: 38,
    travelDurationSeconds: 236,
  },
]
