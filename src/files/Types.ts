export type CrawlOptions = {
  /**
   * Files with extension, eg '.jpg' will be skipped 
   */
  ignoreExtensions?: string[]
  /**
   * If used, only files with these extensions are included.
   */
  includeExtensions?: string[]
  /**
   * If true, only files are returned
   */
  ignoreDirectories?: boolean

  /**
   * Maximum recursion depth.
   * 0 for no recursion.
   */
  maximumDepth?: number
}
