package jar;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "*")
public class TarefaController {
   

        private final TarefaRepository repository;

        public TarefaController(TarefaRepository repository) {
            this.repository = repository;
        }

        @GetMapping("/tarefas")
        public List<Tarefa> listar() {
            return repository.findAll();
        }

        @PostMapping("/tarefas")
        public Tarefa cadastrar(@RequestBody Tarefa tarefa) {
            return repository.save(tarefa);
        }

        @PutMapping("/tarefas/{id}")
        public Tarefa atualizar(
                @PathVariable Long id,
                @RequestBody Tarefa dados) {

                    Tarefa tarefa = repository.findById(id)
                            .orElseThrow();

                    tarefa.setTitulo(dados.getTitulo());
                    tarefa.setConcluida(dados.isConcluida());
                    tarefa.setPrioridade(dados.getPrioridade());

                    return repository.save(tarefa);
                }

                @DeleteMapping("/tarefas/{id}")
                    public void excluir(@PathVariable Long id) {
                    repository.deleteById(id);
        }
    

}