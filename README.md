# develop branch on wangcansunking.github.io

## Purpose
This branch's purpose is to generate blogs from issues to public folder with template and some configs.

## Steps
1. Get blogs from issues with github api.
2. Generate blogs to public folder.
3. Commit content in public folder to master branch.
4. Upload the public folder to other server.

## Attributes of a blog

### Template (Header)
**Why set**

For different blog, we may use different templates. 
The default value is configured in the `config.js`.

**How to set**

In the blog header and the available values are:

- Light
- Dark
- ...

###  Status (Label)
**Set in the issue's label**
1. **Draft**: draft status and not ready to be published.
2. **Completed**: document can be published.
3. **Deleted**: document is removed.

**Priority**: Deleted > Completed > Draft

### Category (Label)
**Set in the issue's label**

- Thinkings
- Life
- Technology

### Other labels (Label)
**Set in the issue's label**
Since we write blog in issues, we could add other label for quicker index.

The reservered words contains words in  **Status** and **Category**.

### SEO (Header)
**Set in the blog's header**
For SEO, I prefer to add those information in the document.

- Keywords (Not important as before, keywords + all the labels will be the keywords generated)
- Description (The blog's purpose)
- Title(default is the blog title)



