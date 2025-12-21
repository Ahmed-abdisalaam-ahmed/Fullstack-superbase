import supabase from "./superbase";

export async function signUp(email, password, username = "") {


  let {data, error} = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if(data?.user){
    const {data : sessionData } = await supabase.auth.getSession()

    if(!sessionData?.session){
        return data;
    }
  }
    const displayName = username || email.split('@')[0];

    // create profile 

    const {data: profileData, error : profileError} = await supabase
       .from('users')
       .insert({
        id: data.user.id,
        username: displayName,
        avatar_url: null
       })
       .select()
       .single()


       if(profileError){
        console.log("Profile creation error:", profileError)
       }else{
        console.log("Profile created successfully", profileData);
       }

}
