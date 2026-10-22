package jar;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MensagemController {

    @GetMapping("/mensagem")
    public String mensagem() {
        return "Minha primeira API funcionando!";
    }
}