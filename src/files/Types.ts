export type CrawlOptions = {
  /**
   * Files with extension, eg '.jpg' will be skipped 
   */
  ignoreExtensions?: Array<string>
  /**
   * If used, only files with these extensions are included.
   */
  includeExtensions?: Array<string>
  /**
   * If true, only files are returned
   */
  ignoreDirectories?: boolean
}
