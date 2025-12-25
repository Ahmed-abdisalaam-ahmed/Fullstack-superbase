import supabase from "./superbase";

export async function signUp(email, password, username = "") {
  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  console.log("Auth signup successfully.", data);

  if (data?.user) {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData?.session) {
      console.log(
        "No active session yet - profile will be created on first sign in"
      );
      return data;
    }

    const displayName = username || email.split("@")[0];

    // create profile

    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: data.user.id,
        username: displayName,
        avatar_url: null,
      })
      .select()
      .single();

    if (profileError) {
      console.log("Profile creation error:", profileError);
    } else {
      console.log("Profile created successfully:", profileData);
    }
  }

  return data;
}

export async function signIn(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  console.log("user Info", data);

  if (error) throw error;

  // check if the user profile exists , create if it doesn't

  if (data?.user) {
    try {
      const profile = await getUserProfile(data.user.id);

      console.log("profile info ", profile);
    } catch (profileError) {
      console.log("Error with profile during signIn:", profileError);
    }
  }
}

export async function getUserProfile(userId) {
  const { data: sessionData } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single(); // waxay ka dhigaysaa one object becuase data waxay soo celinaysa a array

  if (error && error.code === "PGRST116") {
    console.log("No profile found, attempting to create one for user:", userId);

    const { data : userData } = await supabase.auth.getUser();

    console.log("true Data", userData);

    // get user email to drive username if needed
    const email = userData?.user.email;

    // eldinshehab87  @  gmail.com
    const defaultUsername = email ? email.split("@")[0] : `user_${Date.now()}`;

    // create profile
    const { data: newProfileData, error: newProfileError } = await supabase
      .from("users")
      .insert({
        id: userId,
        username: defaultUsername,
        avatar_url: null,
      })
      .select()
      .single();

    if (newProfileError) {
      console.log("Profile creation error:", newProfileError);
      throw newProfileError;
    } else {
      console.log("Profile created successfully:", newProfileData);
    }

    return newProfileData;
  }

  // geraenal error
  if (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }

  console.log("existing profile");

  return data;
}

export function onAuthchange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null, event);
  });

  return () => data.subscription.unsubscribe();
}

export async function signOut(){
  await supabase.auth.signOut()
}
