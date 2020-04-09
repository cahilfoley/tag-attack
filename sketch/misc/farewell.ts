interface Message {
  content: string
  sender: string
}

let farewellMessages: Message[] = [
  {
    content: trimmed`
      Hey Ayesha, sad to hear that you are leaving the team.
      
      We didn’t work together, but who else would I talk to about the new bbt place that I’ve tried over the weekend or how crappy the shopping is in perth.
      Will miss having you around!
      
      KIT and hope to see you around with a milk tea in hand ;-)
    `,
    sender: 'Gabrielle',
  },
  {
    content: trimmed`
      Hi Ayesha,
      
      It was a pleasure working with you. All the very best. Take care and stay safe.
      
      Cheers
      Sharief
    `,
    sender: 'Sharief',
  },
  {
    content: trimmed`
      Hey Ayesha
      
      Going to miss having you in the team, a fellow chick who knew how to cook and loved to talk hair, fashion and other girlie stuff with a this frumpie mum are very hard to find. Your help over the months has been invaluable as has been the friendship
      
      Cheers Amanda    
    `,
    sender: 'Amanda',
  },
  {
    content: trimmed`
      Hey Ayesha!
      
      Sad to “virtually” see you go! Definitely know it won’t be the last time we see each other! It’s been great working with you on some mentally challenging projects hahaha
      In hindsight i should of come met Yufei with you, Big regrets! Lets catch up for drinks when this is all over :D
      
      All the best
      Kent
    `,
    sender: 'Kent',
  },
  {
    content: trimmed`
      Hi PowerBI Guru,
      
      It was such a great pleasure working with you. 
      Thank you heaps for the tremendous contribution and support you brought to the team, including me.
      We have definitely learnt a lot from you, especially the PowerBI tricks, and have enjoyed working with you.
      Thanks for helping me out with organising some gatherings with the team. I will miss buying doughnuts with you  
      Perth is small and I’m sure we will cross paths again on future projects or even, outside work…who knows  
      Btw, I’m still waiting for your dancing video  
      
      I wish you all the best in your other projects.
      
      Take care,
      Tina
    `,
    sender: 'Tinaaaaaaaaaaaaaaaaa',
  },
  {
    content: trimmed`
      Hi FJ,
      
      Thanks for all your time and help with SQL, SSRS, PowerBI.... well <span class='flashing'><em>everything!</em></span> You have been a great source of information and your input is always highly valued.
      
      I ran of out words and used them all on building this with <span class='flashing'>Cahil</span> . 
      
      Stay in touch and enjoy your game,
      
      <span class='flashing'>Steve</span>
      `,
    sender: `<span class='flashing'>Steve</span>`,
  },
  {
    content: trimmed`
      Hey Ayesha,
      
      So sad to see you're leaving - I'm going to miss learning loads of interesting pop culture facts at lunch.
      
      You've been an absolute star in the team, no matter what came up you just take in in stride, wherever you're headed next they are lucky to have you!
      
      All the best for everything the future holds, I hope our we see you around again one day!
      
      <span class='flashing'>Cahil</span>
    `,
    sender: `<span class='flashing'>Cahil</span>`,
  },
  {
    content: trimmed`
      Thanks for your commitment and persistence.

      You always find a way to get it done.
    `,
    sender: 'Fredy',
  },
  {
    content: trimmed`
      Hi Ayesha,
      
      Thanks for your contribution to L&H reporting improvements. All the best for your new chapter!
      
      Cheers,
      Ginger    
    `,
    sender: 'Ginger',
  },
  {
    content: trimmed`
      Hey Ayesha!

      Thank you for all the hard work you’ve put in, the laughs, and most of all putting up with me :D I hope your next project goes smooth and that we cross paths again sooner rather than later. You’re always welcome for noodles. 
      
      Cheers,
      Boxy    
    `,
    sender: 'Boxy',
  },
]
