- Analyze project
- Suggestion of improvemnt
- Make sure the try catch in localized lable 
- Why asyn await in client not in server ?
- Make the code متناسق
- Make it better , avoid boiler plate
- Make Performance of fonts better
- Try too make PageLayout is more smaller but if the'r is overkill 
- is it best practice using createInstance in I18nProviderClient? -- update docs 
- Make sure update other effected files after using useMemo() in I18nProviderClient
- Make sure the useMemo in I18nProviderClient is best practice
 Feature | How to add |
|---|---|
| **Search with Arabic diacritics** | Install `arabic-persian-search` npm pkg → normalize strings before `.includes()` |
| **Pagination** | Use `searchParams.page` + `slice((page-1)*12, page*12)` |
| **SEO** | Add `generateMetadata({ params })` in `page.tsx` → return `{title: …, openGraph: …}` |
| **CMS** | Replace static `scholars.ts` with **Sanity**, **Strapi**, or **Contentful** |
| **Tests** | Use **Playwright** to click language switcher → assert `<html lang="ar">` |
| **Deploy** | Push to **GitHub** → import repo into **Vercel** → zero-config deploy |
- Make some block of codes is simpler , writ in simpler way             

    

