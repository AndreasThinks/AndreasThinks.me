<!--
.. title: contact
.. slug: contact
.. date: 2020-12-28 15:42:27 UTC
.. hidetitle: True
.. tags:
.. category:
.. link:
.. description:
.. type: text
-->
<br>
If you'd like to discuss anything at all, please get in touch! The form below will send me an email, and I'll get back to you as soon as I can.
<br>

<form action="https://formspree.io/mvovozzg" method="POST">
    <fieldset>
        <label for="name">Your name</label><br>
        <input type="text" name="name" placeholder="Name" required>
    </fieldset>
    <fieldset>
        <label for="_replyto">Your email</label><br>
        <input type="email" name="_replyto" placeholder="example@domain.com" required>
    </fieldset>
    <fieldset>
        <label for="message">Your message</label><br>
        <textarea name="message" rows="1" placeholder="Message" required></textarea>
    </fieldset>
    <input class="hidden" type="text" name="_gotcha" style="display:none">
    <input class="hidden" type="hidden" name="_subject" value="Message via http://domain.com">
<input class="button submit" type="submit" value="Send">
</form>
