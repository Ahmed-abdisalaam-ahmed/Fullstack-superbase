Sidee u shaqeeyaa !! (Double Bang)?
U maley operator-kan inuu yahay "Mashiinka Xaqiijinta":

Kan kowaad (!): Wuxuu ka dhigaa waxa ka dambeeya "lidkooda" (opposite). Haddii ay wax jiraan, wuxuu ka dhigaa false.

Kan labaad (!!): Wuxuu haddana dib ugu soo celiyay sidii saxda ahayd laakiin isagoo ah Boolean (True ama False) oo keliya.

Tusaale cad:
Ka soo qaad in user uu yahay object (qof jira):

user = { name: "Ahmed" } (Waa wax jira)

!user = wuxuu noqonayaa false (maxaa yeelay wuxuu rogaa jiritaankii).

!!user = wuxuu noqonayaa true (wuxuu dib u rogaa false-kii).

Haddii user uu yahay null (qofna ma jiro):

user = null

!user = wuxuu noqonayaa true.

!!user = wuxuu noqonayaa false.

Maxaa looga door bidaa hababka kale?
Programmers-ku waxay u isticmaalaan si ay koodka u soo gaabiyaan. Halkii aad qori lahayd: const isLoggedIn = user ? true : false;

Waxaad si gaaban u qori kartaa: const isLoggedIn = !!user;

Waa isku mid, laakiin tan dambe ayaa ka casrisan (cleaner code).