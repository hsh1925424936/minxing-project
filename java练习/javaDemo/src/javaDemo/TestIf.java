package javaDemo;
//²âÊÔifÓï¾ä
public class TestIf {
	public static void main(String[] args){
		/*
		double a = Math.random();
		int b = (int)(a+1);
		if(a<0.5){
			System.out.println("a:" + a + "c:" + b );
		}else{
			System.out.println("a:" + a + "  " + "b:" + b);
		}
		*/
		
		//switch--case
		char c = 'a';
		char d = (char)(c+26*Math.random()); 
//		System.out.println(d);
		switch(d){
		  case 'a':
		  case 'e':
		  case 'i':
		  case 'o':
		  case 'u':
			  System.out.println("ÔªÒô×ÖÄ¸");
			  break;
		  default:
			  System.out.println("¹ş¹ş¹ş");
		}
	}
}
