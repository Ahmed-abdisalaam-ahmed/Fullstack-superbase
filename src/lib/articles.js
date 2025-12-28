import supabase from './superbase'


export const createArticle = async(article) => {

    console.log("creating article with data: ")

    const articleData = {
        title: article.title,
        content: article.content,
        tags: article.tags,
        author_id: article.authorId,
        published: article.published || false,
        featured_image: article.featuredImageUrl || null
    }

    // insert to supabase

    const { data , error } = await supabase
    .from('articles')
    .insert(articleData)
    .select()
    .single()

    if(error){
        console.error("Error createing article", error)
        throw error
    }
    console.log("Article created successfully.", data)

    return data
}