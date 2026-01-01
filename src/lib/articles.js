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
        console.error("Error creteing article", error)
        throw error
    }
    console.log("Article created successfully.", data)

    return data
}


export const getArticleByAuthor = async(authorId, {includeUnPublished = false, limit = 10, offset = 0}) => {
    // all articles 100 weeye T.S = tusaale

// offset 0 : meesha oo ka bilabanayo -> 10 -> 20 -> 30 up sidaa ayuu usocn.

// limit 10 : waa xadiga aad rabtid inoo page-ka soo muuqdo.

// acsending = waa sidee ay ukala danbeeyen usoo kala hormari
    let query = supabase 
        .from('articles')
        .select(`
         *,
         comments:comments(count)`)
        .eq('author_id', authorId)
        .order('created_at', {ascending: false})
        .range(offset, offset + limit - 1)
    
    if(!includeUnPublished){
        query  = query.eq('published', true)
    }

    const {data , error , count } = await query

    if(error) throw error

    return{
        articles : data,
        count
    }
}

export const deleteArticle = async (id) => {
    console.log(`Atttemping to delete article with ID: ${id}`)



    // first delete all asscited comments 
    const {error: commentsError} = await supabase.from('comments').delete().eq('article_id',id)


    if (commentsError) {
        console.error('Error deleting comments:', commentsError)
        console.error('Comments error details:', JSON.stringify(commentsError, null, 2))
    } else {
        console.log('Successfully deleted associated comments')
    }

    // Finnaly delete the article 

    const {data, error} = await supabase.from('articles').delete().eq('id',id)

    if(error) {
        console.error('Error deleting article:', error)
        console.error('Article error details:', JSON.stringify(error, null, 2))
        throw error

    } else {
        console.log(`Successfully deleted article with ID: ${id}`)
    }

    return data
}   