class GoogleDriveUtils {
  constructor (accessToken = null) {
    this.boundaryString = 'foo_bar_baz'
    this.setAccessToken(accessToken)
    this.url = 'https://www.googleapis.com/drive/v3'
    this.uploadUrl = 'https://www.googleapis.com/upload/drive/v3'
  }

  setAccessToken (accessToken) {
    this.accessToken = accessToken
  }

  parseAndHandleErrors (response) {
    if (response.ok) {
      return response.json()
    }
    return response.json().then(error => {
      throw new Error(JSON.stringify(error))
    })
  }

  configureGetOptions () {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this.accessToken}`)
    return {
      method: 'GET',
      headers
    }
  }

  configurePostOptions (bodyLength, isUpdate = false) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this.accessToken}`)
    headers.append(
      'Content-Type',
      `multipart/related; boundary=${this.boundaryString}`
    )
    headers.append('Content-Length', bodyLength)
    return {
      method: isUpdate ? 'PATCH' : 'POST',
      headers
    }
  }

  createMultipartBody = (body, isUpdate = false) => {
    const metaData = {
      name: 'data.json',
      mimeType: 'application/json'
    }

    // If it already exists, specifying parents again throws an error
    if (!isUpdate) metaData.parents = ['appDataFolder']

    // Request body
    const multipartBody =
      `\r\n--${this.boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metaData)}\r\n` +
      `--${this.boundaryString}\r\nContent-Type: application/json\r\n\r\n` +
      `${JSON.stringify(body)}\r\n` +
      `--${this.boundaryString}--`

    return multipartBody
  }

  // Uploads a file with its contents and its meta data (name, description, type, location)
  uploadFile (content, existingFileId) {
    const body = this.createMultipartBody(content, !!existingFileId)
    const options = this.configurePostOptions(body.length, !!existingFileId)
    return fetch(
      `${this.uploadUrl}/files${
        existingFileId ? `/${existingFileId}` : ''
      }?uploadType=multipart`,
      {
        ...options,
        body
      }
    ).then(this.parseAndHandleErrors)
  }

  // Looks for files with the specified file name in app data folder only (appDataFolder is a magic keyword)
  queryParams () {
    return encodeURIComponent(
      "name = 'data.json' and 'appDataFolder' in parents"
    )
  }

  // Returns the files meta data only. Id can then be used to download the file
  getFile () {
    const qParams = this.queryParams()
    const options = this.configureGetOptions()
    return fetch(`${this.url}/files?q=${qParams}&spaces=appDataFolder`, options)
      .then(this.parseAndHandleErrors)
      .then(body => {
        if (body && body.files && body.files.length > 0) return body.files[0]
        return null
      })
  }

  // Download the file contents given the id
  downloadFile (existingFileId) {
    const options = this.configureGetOptions()
    if (!existingFileId) throw new Error('Invalid file id')
    return fetch(`${this.url}/files/${existingFileId}?alt=media`, options).then(
      this.parseAndHandleErrors
    )
  }
}

export default GoogleDriveUtils
