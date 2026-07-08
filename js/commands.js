#terminal{
    width:min(1100px,95%);
    height:80vh;

    margin:auto;

    border:1px solid #00ff88;
    background:#050505;

    box-shadow:0 0 25px rgba(0,255,136,.2);

    display:flex;
    flex-direction:column;
}

.terminal-header{

    padding:12px;

    border-bottom:1px solid rgba(0,255,136,.2);

    color:#00ff88;

    letter-spacing:2px;

}

#terminalOutput{

    flex:1;

    overflow-y:auto;

    padding:20px;

}

.line{

    margin-bottom:10px;

}

.highlight{

    color:#ffffff;

}

.terminal-input{

    display:flex;

    align-items:center;

    gap:10px;

    padding:15px 20px;

    border-top:1px solid rgba(0,255,136,.2);

}

.prompt{

    color:#00ff88;

}

#commandInput{

    flex:1;

    background:transparent;

    border:none;

    outline:none;

    color:#00ff88;

    font:inherit;

}
