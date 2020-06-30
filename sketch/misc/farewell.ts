interface Message {
  content: string
  sender: string
}

let farewellMessages: Message[] = [
  {
    content: trimmed`
      Hola Matt!

      I can’t believe you’re leaving me. It’s not fair. Who else will appreciate terrible pop culture references. No one. That’s who. Fine. Go. Bye Felicia.
      Despite my personal misery I wish you all the best in your next project and hope our paths cross again. Your expertise has been extremely valuable input into the team and we are in a much better place today because of it. The Koodaideri team will be very lucky to also share in your amazingness. Stay safe and classy.
      
      Boxy
    `,
    sender: 'Boxy',
  },
  {
    content: trimmed`
      Thanks for the laughs, the reboot card saves and hopefully you can still join for some team building
    `,
    sender: 'Amanda',
  },
  {
    content: trimmed`
      Best Wishes on your pregnancy   
    `,
    sender: 'Aiden',
  },
  {
    content: trimmed`
      Hi Matt,
  
      Its been really good working with you, appreciate the work and contributions you have made to the team.
      Shame i didn't get to work with you much but im sure you are pretty scared when you set the bar really high with the tagging stuff.
      
      Best of luck in the future, im sure we will together again
      
      Thanks,
      Kent
    `,
    sender: 'Kent',
  },
  {
    content: trimmed`
      Matt Matt Matt,

      It was such a pleasure working with you and having you in the team.
      Thank you heaps for your great work and contributions in helping us improve Passport.
      You will be missed but I'm sure we will see you again since Perth is small.
      I wish you all the best for the Koodaideri project and other projects you will be working on.
      
      Stay safe and Take care,
      Tina
    `,
    sender: 'Tinaaaaaaaaaaaaaaaaa',
  },
  {
    content: trimmed`
      Hey Matt,
      Thanks for all your help over the last 9+ months. It has been great to have your positive attitude around the office especially when working on the new and complex parts of webcore. Your sense of humor will be missed and good luck with your next project!
      Cheers,
      Steve
    `,
    sender: `Steve`,
  },
  {
    content: trimmed`
      Hey Matt,
      
      It's been a please working with you, you're a quick learner and you've made some awesome contributions!
      
      Thanks for carrying the squad and I in Fortnite, we'll have to keep you around for the lunch hour of power if we want to have any chance of winning again.
      
      All the best,
      <span class='flashing'>Cahil</span>
    `,
    sender: `<span class='flashing'>Cahil</span>`,
  },
  {
    content: trimmed`
      Matt you are a great team member and helped us with progressing PASSPORT further.
      
      Thanks and keep in touch
    `,
    sender: 'Prateek',
  },
  {
    content: trimmed`
      Matt, thanks for all of your support during some crazy times!
      
      Looking forward to working with you again in the future if the opportunity arises.
      
      All the best!   
    `,
    sender: 'Matt (no not you silly, Matt Paps)',
  },
  {
    content: trimmed`
      Do
    `,
    sender: 'Bruce',
  },
]
