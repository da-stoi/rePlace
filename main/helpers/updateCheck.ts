import { app } from 'electron'
import type { Asset, UpdateData, UpdateDetails } from '../../renderer/types'
import { store } from '../background'
import 'dotenv/config'

function platformFromAsset(asset: Asset): string | null {
  switch (asset.browser_download_url.split('.').pop()) {
    case 'dmg':
      return 'darwin'
    case 'exe':
      return 'win32'
    case 'AppImage':
      return 'linux'
    case 'deb':
      return 'linux'
    default:
      return null
  }
}

export default async function checkForAppUpdate(
  preRelease = false
): Promise<UpdateDetails | false> {
  let updateAvailable = false
  let updateDetails: UpdateDetails
  const platform = process.platform
  const currentVersion = app.getVersion()
  const lastFetchedUpdate = store.get('latestUpdate', false) as
    | UpdateDetails
    | false

  const lastCheck = store.get('lastUpdateCheck', 0) as number

  const now = Date.now()
  if (lastCheck && now - lastCheck < 1000 * 60 * 60 * 1) {
    // 1 hour
    if (
      lastFetchedUpdate &&
      currentVersion !== lastFetchedUpdate?.id.replace('v', '')
    ) {
      if (!preRelease && lastFetchedUpdate.preRelease) {
        // If pre-release is disabled, check if the last fetched update is a pre-release
        return false
      }
      return lastFetchedUpdate
    }
    return false
  }

  // Fetch latest release from GitHub
  const updateRes = await fetch(
    'https://api.github.com/repos/da-stoi/rePlace/releases'
  )
  let updateDataArray = (await updateRes.json()) as UpdateData[]

  if (!Array.isArray(updateDataArray)) {
    console.error('Failed to fetch update data')
    return lastFetchedUpdate
  }

  updateDataArray = updateDataArray.filter(
    (release: UpdateData) => release.draft === false
  ) // Filter out drafts

  // If pre-release is disabled, filter out pre-releases
  if (!preRelease) {
    updateDataArray = updateDataArray.filter(
      (release: UpdateData) => release.prerelease === false
    )
  }

  const updateData = updateDataArray[0] // Get latest release

  const latestVersion = updateData?.tag_name.replace('v', '')

  // Check if update is available
  if (currentVersion !== latestVersion && updateData.draft === false) {
    updateAvailable = true

    const assets: Asset[] = updateData.assets
      .map((asset: Asset) => ({
        ...asset,
        platform: platformFromAsset(asset)
      }))
      .filter(asset => asset.platform !== null)

    // Parse update data
    updateDetails = {
      name: updateData.name,
      id: updateData.tag_name,
      preRelease: updateData.prerelease,
      publishedAt: updateData.published_at,
      body: updateData.body,
      platformAssets: assets.filter(asset => asset.platform === platform),
      otherAssets: assets.filter(asset => asset.platform !== platform)
    }
  }

  store.set('lastUpdateCheck', now)
  store.set('latestUpdate', updateDetails)

  return updateAvailable ? updateDetails : false
}
